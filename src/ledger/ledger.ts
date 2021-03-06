import {validate} from '../common'
import {FormattedLedger, parseLedger} from './parse/ledger'
import {StoxumAPI} from '../api'

export type GetLedgerOptions = {
  ledgerVersion?: number,
  includeAllData?: boolean,
  includeTransactions?: boolean,
  includeState?: boolean
}

async function getLedger(
  this: StoxumAPI, options: GetLedgerOptions = {}
): Promise<FormattedLedger> {
  // 1. Validate
  validate.getLedger({options})
  // 2. Make Request
  const response = await this._request('ledger', {
    ledger_index: options.ledgerVersion || 'validated',
    expand: options.includeAllData,
    transactions: options.includeTransactions,
    accounts: options.includeState
  })
  // 3. Return Formatted Response
  return parseLedger(response.ledger)
}


export default getLedger
