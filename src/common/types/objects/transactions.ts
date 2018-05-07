import {StoxumdAmount} from './amounts'
import {Memo} from './memos'

export interface OfferCreateTransaction {
  TransactionType: 'OfferCreate',
  Account: string,
  AccountTxnID?: string,
  Fee: string,
  Field: any,
  Flags: number,
  LastLedgerSequence?: number,
  Sequence: number,
  Signers: any[],
  SigningPubKey: string,
  SourceTag?: number,
  TakerGets: StoxumdAmount,
  TakerPays: StoxumdAmount,
  TxnSignature: string,
  Expiration?: number,
  Memos?: Memo[],
  OfferSequence?: number,
}
