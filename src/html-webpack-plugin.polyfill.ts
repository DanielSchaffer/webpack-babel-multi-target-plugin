import { getHooks, AlterAssetTagsData, HtmlTag } from 'html-webpack-plugin'
import { compilation } from 'webpack'
import Compilation = compilation.Compilation

const isV4 = typeof getHooks !== 'undefined'

export const getBodyTags = (data: AlterAssetTagsData): HtmlTag[] =>
  isV4 ? (data as any).bodyTags : data.body
export const setBodyTags = (data: AlterAssetTagsData, body: HtmlTag[]): void => {
  isV4 ? (data as any).bodyTags = body : data.body = body
}
export const getHeadTags = (data: AlterAssetTagsData): HtmlTag[] =>
  isV4 ? (data as any).headTags : data.head

export const getAlterAssetTags = (compilation: Compilation): any =>
  isV4 ? getHooks(compilation).alterAssetTagGroups : compilation.hooks.htmlWebpackPluginAlterAssetTags
