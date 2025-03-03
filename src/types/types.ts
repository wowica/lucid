import { Core } from "../core/mod.ts";
import { Constr } from "../plutus/mod.ts";

type CostModel = Record<string, number>;

export type CostModels = Record<ScriptType, CostModel>;

export type ProtocolParameters = {
  minFeeA: number;
  minFeeB: number;
  maxTxSize: number;
  maxValSize: number;
  keyDeposit: bigint;
  poolDeposit: bigint;
  priceMem: number;
  priceStep: number;
  maxTxExMem: bigint;
  maxTxExSteps: bigint;
  coinsPerUtxoByte: bigint;
  collateralPercentage: number;
  maxCollateralInputs: number;
  costModels: CostModels;
};

export type Slot = number;

export interface Provider {
  getProtocolParameters(): Promise<ProtocolParameters>;
  getUtxos(address: Address): Promise<UTxO[]>;
  getUtxosWithUnit(address: Address, unit: Unit): Promise<UTxO[]>;
  getUtxosByOutRef(outRefs: Array<OutRef>): Promise<UTxO[]>;
  getDelegation(rewardAddress: RewardAddress): Promise<Delegation>;
  getDatum(datumHash: DatumHash): Promise<Datum>;
  awaitTx(txHash: TxHash): Promise<boolean>;
  submitTx(tx: Transaction): Promise<TxHash>;
}

export type Credential = {
  type: "Key" | "Script";
  hash: KeyHash | ScriptHash;
};

/** Concatenation of policy id and asset name in Hex */
export type Unit = string;
export type Assets = Record<string, bigint>;
export type ScriptType = "Native" | "PlutusV1" | "PlutusV2";

/** Hex */
export type PolicyId = string;

/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type Script = { type: ScriptType; script: string };
/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type Validator =
  | MintingPolicy
  | SpendingValidator
  | CertificateValidator
  | WithdrawalValidator;
/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type MintingPolicy = Script;
/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type SpendingValidator = Script;
/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type CertificateValidator = Script;
/**
 * Plutus scripts need to be double Cbor encoded.
 * Raw compiled scripts without any Cbor encoding do not work.
 */
export type WithdrawalValidator = Script;
/** Bech32 */
export type Address = string;
/** Bech32 */
export type RewardAddress = string;
/** Hex */
export type PaymentKeyHash = string;
/** Hex */
export type StakeKeyHash = string;
/** Hex */
export type KeyHash = string | PaymentKeyHash | StakeKeyHash;
/** Hex */
export type VrfKeyHash = string;
/** Hex */
export type ScriptHash = string;
/** Hex */
export type TxHash = string;
/** Bech32 */
export type PoolId = string;
/** Hex */
export type Datum = string;
/**
 * asHash will add the datum hash to the output and the datum to the witness set.
 * inline will add the datum to the output.
 * scriptRef will add any script to the output.
 * You can only specify asHash or inline, not both at the same time.
 */
export type OutputData = { asHash?: Datum; inline?: Datum; scriptRef?: Script };
/** Hex */
export type DatumHash = string;
/** Hex (Redeemer is only PlutusData, same as Datum) */
export type Redeemer = string; // Plutus Data (same as Datum)
export type Lovelace = bigint;
export type Label = number;
/** Hex */
export type TransactionWitnesses = string;
/** Hex */
export type Transaction = string;
/** Bech32 */
export type PrivateKey = string;
/** Bech32 */
export type PublicKey = string;
/** Hex */
export type ScriptRef = string;
/** Hex */
export type Payload = string;

export type UTxO = {
  txHash: TxHash;
  outputIndex: number;
  assets: Assets;
  address: Address;
  datumHash?: DatumHash;
  datum?: Datum;
  scriptRef?: ScriptRef;
};

export type OutRef = { txHash: TxHash; outputIndex: number };

export type AddressType = "Base" | "Enterprise" | "Pointer" | "Reward";

export type Network = "Mainnet" | "Testnet" | "Preview" | "Preprod";

export type AddressDetails = {
  type: AddressType;
  networkId: number;
  address: { bech32: Address; hex: string };
  paymentCredential?: Credential;
  stakeCredential?: Credential;
};

export type Delegation = {
  poolId: PoolId | null;
  rewards: Lovelace;
};

/**
 * A wallet that can be constructed from external data e.g utxos and an address.
 * It doesn't allow you to sign transactions/messages. This needs to be handled separately.
 */
export interface ExternalWallet {
  address: Address;
  utxos?: UTxO[];
  rewardAddress?: RewardAddress;
}

export type SignedMessage = { signature: string; key: string };

export interface Wallet {
  address(): Promise<Address>;
  rewardAddress(): Promise<RewardAddress | null>;
  getUtxos(): Promise<UTxO[]>;
  getUtxosCore(): Promise<Core.TransactionUnspentOutputs>;
  getDelegation(): Promise<Delegation>;
  signTx(tx: Core.Transaction): Promise<Core.TransactionWitnessSet>;
  signMessage(
    address: Address | RewardAddress,
    payload: Payload,
  ): Promise<SignedMessage>;
  submitTx(signedTx: Transaction): Promise<TxHash>;
}

/**
 * These are the arguments that conform a BuiltinData in Plutus:
 * data Data =
 *   Constr Integer [Data]
 * | Map [(Data, Data)]
 * | List [Data]
 * | I Integer
 * | B BS.ByteString
 *   deriving stock (Show, Eq, Ord, Generic)
 *   deriving anyclass (NFData)
 */
export type PlutusData =
  | bigint
  | Bytes
  | Array<PlutusData>
  | Map<PlutusData, PlutusData>
  | Constr<PlutusData>; // We emulate the constr like this

/** Hex in case of string. */
type Bytes = string | Uint8Array;

/** JSON object */
// deno-lint-ignore no-explicit-any
export type Json = any;

/** Time in milliseconds */
export type UnixTime = number;

type NFTFile = {
  name: string;
  mediaType: string;
  src: string | string[];
};

export type NFTMetadataDetails = {
  name: string;
  image: string;
  mediaType?: string;
  description?: string | string[];
  files?: NFTFile[];
  [key: string]: unknown;
};

export type PoolParams = {
  poolId: PoolId;
  vrfKeyHash: VrfKeyHash;
  pledge: Lovelace;
  cost: Lovelace;
  margin: number;
  rewardAddress: RewardAddress;
  owners: Array<RewardAddress>;
  relays: Array<Relay>;
  metadataUrl?: string;
};

export type Relay = {
  type: "SingleHostIp" | "SingleHostDomainName" | "MultiHost";
  ipV4?: string;
  ipV6?: string;
  port?: number;
  domainName?: string;
};

export type NativeScript = {
  type: "sig" | "all" | "any" | "before" | "atLeast" | "after";
  keyHash?: KeyHash;
  required?: number;
  slot?: Slot;
  scripts?: NativeScript[];
};

export type SlotConfig = {
  zeroTime: UnixTime;
  zeroSlot: Slot;
  slotLength: number; // number of milliseconds.
};
