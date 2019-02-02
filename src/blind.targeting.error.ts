export class BlindTargetingError extends Error {
  constructor(request: string) {
    super(`Encountered unexpected blind targeting request for ${request}.` +
            'Please see http://github.com/DanielSchaffer/webpack-babel-multi-target-plugin#blind-targeting for more information.')
  }
}
