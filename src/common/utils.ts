import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
const {deriveKeypair} = require('stoxum-keypairs')

import {Amount, StoxumdAmount} from './types/objects'

function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret)
    return true
  } catch (err) {
    return false
  }
}

function dropsToXrp(drops: string): string {
  return (new BigNumber(drops)).dividedBy(1000000.0).toString()
}

function xrpToDrops(xrp: string): string {
  return (new BigNumber(xrp)).times(1000000.0).floor().toString()
}

function toStoxumdAmount(amount: Amount): StoxumdAmount {
  if (amount.currency === 'XRP') {
    return xrpToDrops(amount.value)
  }
  return {
    currency: amount.currency,
    issuer: amount.counterparty ? amount.counterparty :
      (amount.issuer ? amount.issuer : undefined),
    value: amount.value
  }
}

function convertKeysFromSnakeCaseToCamelCase(obj: any): any {
  if (typeof obj === 'object') {
    let newKey
    return _.reduce(obj, (result, value, key) => {
      newKey = key
      // taking this out of function leads to error in PhantomJS
      const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g
      if (FINDSNAKE.test(key)) {
        newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase())
      }
      result[newKey] = convertKeysFromSnakeCaseToCamelCase(value)
      return result
    }, {})
  }
  return obj
}

function removeUndefined<T extends object>(obj: T): T {
  return _.omitBy(obj, _.isUndefined) as T
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 *
 */
function stoxumToUnixTimestamp(rpepoch: number): number {
  return (rpepoch + 0x386D4380) * 1000
}

/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since ripple epoch ( 1/1/2000 GMT)
 */
function unixToStoxumTimestamp(timestamp: number): number {
  return Math.round(timestamp / 1000) - 0x386D4380
}

function stoxumTimeToISO8601(stoxumTime: number): string {
  return new Date(stoxumToUnixTimestamp(stoxumTime)).toISOString()
}

function iso8601ToStoxumTime(iso8601: string): number {
  return unixToStoxumTimestamp(Date.parse(iso8601))
}

export {
  dropsToXrp,
  xrpToDrops,
  toStoxumdAmount,
  convertKeysFromSnakeCaseToCamelCase,
  removeUndefined,
  stoxumTimeToISO8601,
  iso8601ToStoxumTime,
  isValidSecret
}

