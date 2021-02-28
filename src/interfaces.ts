export type NonceArray = Array<number>

export type VoteType = number
export const ACCEPT = 1
export const REJECT = 2

export interface Vote {
    hash: string
    knownValues: KnownVoteValues
    unknownValues: UnknownVoteValues
}

export interface KnownVoteValues {
    proposalId: number
    voterAddress: string
}

export interface UnknownVoteValues {
    nonces: NonceArray
    voteType: VoteType
}
