import { TransformOptions } from 'babel-core';
import { Condition, Loader, LoaderRule, NewLoader, NewUseRule, OldLoader, Rule } from 'webpack';

export const BABEL_LOADER = 'babel-loader';

/**
 * @internal
 */
export interface RuleConversionResult {
    converted: number;
    rules: Rule[];
}

/**
 * @internal
 */
export interface LoaderConversionResult {
    converted: number;
    loaders: Loader | Loader[];
}

/**
 * @internal
 */
export interface LoaderArrayConversionResult extends LoaderConversionResult {
    loaders: Loader[];
}

/**
 * @internal
 */
export class BabelRuleConverter {

    private convertLoader(loader: Loader, options: TransformOptions): NewLoader {
        const ogOptions = loader ? (loader as NewLoader).options || (loader as OldLoader).query : {};
        return {
            loader: BABEL_LOADER,
            options: Object.assign(ogOptions, options),
        };
    }

    private findAndConvertLoaders(ruleLoaders: Loader | Loader[], options: TransformOptions): LoaderConversionResult {

        if (Array.isArray(ruleLoaders)) {
            const loaders: Loader[] = ruleLoaders as Loader[];
            return loaders.reduce((result: LoaderArrayConversionResult, loader: Loader) => {
                if (!this.isBabelLoader(loader)) {
                    result.loaders.push(loader);
                    return result;
                }
                result.loaders.push(this.convertLoader(loader, options));
                result.converted++;
                return result;
            }, { converted: 0, loaders: []});
        }

        const loader = ruleLoaders as Loader;
        if (!this.isBabelLoader(loader)) {
            return {
                converted: 0,
                loaders: loader,
            };
        }

        return {
            converted: 1,
            loaders: this.convertLoader(loader, options),
        };
    }

    private isBabelLoader(loader: Loader): boolean {
        if (loader === BABEL_LOADER) {
            return true;
        }
        return (loader as OldLoader | NewLoader).loader === BABEL_LOADER;
    }

    public convertLoaders(rules: Rule[], exclude: Condition[], options: TransformOptions): RuleConversionResult {
        return rules.reduce((result: RuleConversionResult, rule: Rule) => {
            const loaderRule: LoaderRule = rule as LoaderRule;
            const useRule: NewUseRule = rule as NewUseRule;
            const loaders = loaderRule.loader || useRule.use;
            const loaderConversion = this.findAndConvertLoaders(loaders, options);
            useRule.use = loaderConversion.loaders;
            if (!useRule.exclude) {
                useRule.exclude = [];
            } else if (!Array.isArray(useRule.exclude)) {
                useRule.exclude = [ useRule.exclude ];
            }
            (useRule.exclude as Condition[]).push(...exclude);
            result.rules.push(useRule);
            result.converted += loaderConversion.converted;
            return result;
        }, { converted: 0, rules: [] });
    }
}
