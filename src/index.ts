// TODO: Add debug
import Web3 from 'web3'

import {
    ACCEPT,
    REJECT,
    KnownVoteValues,
    UnknownVoteValues,
    NonceArray,
    Vote,
    VoteType
} from './interfaces'

const DIFFICULTY = parseInt(process.env.DIFFICULTY, 10) || 255

// TODO: Add vote generation

/**
 * Returns nonces that produce a hash matching the vote hash
 * @dev Iterates through all possible permutations of nonces taking the hash of
 * the nonces and the vote values and comparing that hash to the vote hash.
 * @param nonces Array of uint8 numbers
 * @param currentIndex Index in the nonces array 
 * @param vote Contains hash to match
 */
export function mine(
    nonces: NonceArray,
    currentIndex: number,
    vote: Vote
): UnknownVoteValues | null {
    if (currentIndex < 1) {
        return null
    }

    if (currentIndex > 0) {
        let foundMatchValues: UnknownVoteValues | null = null
        for (let idx = 0; idx < DIFFICULTY + 1; idx++) {
            foundMatchValues = mine(nonces, currentIndex - 1, vote)
            if (foundMatchValues != null) break

            const {found, values} = match(vote, nonces)
            if (found) {
                foundMatchValues = values
                break
            }
            nonces[nonces.length - currentIndex] = idx
            // TODO: log nonces in debug mode
        }
        return foundMatchValues
    }
}

/**
 * Hashes vote values with nonce and returns the values if the generated hash
 * matches the given vote hash.
 * @param vote Contains hash and values
 * @param nonces Array of uint8 numbers
 */
function match(
    vote: Vote,
    nonces: NonceArray
): {found: boolean, values: UnknownVoteValues} {
    let found = false
    let hash: string

    let voteType: VoteType = ACCEPT 
    hash = getHash(vote.knownValues, voteType, nonces)
    if (hash == vote.hash) return { found: true, values: { nonces, voteType } }

    voteType = REJECT
    hash = getHash(vote.knownValues, voteType, nonces)
    if (hash == vote.hash) return { found: true, values: { nonces, voteType } }

    return { found, values: null }
}

/**
 * Hashes vote values and vote type with nonces
 * @param values Known vote values
 * @param voteType 1 for accept, 2 for reject
 * @param nonces Array of uint8 numbers
 */
function getHash(
    values: KnownVoteValues,
    voteType: VoteType,
    nonces: NonceArray
) {
    return Web3.utils.soliditySha3(
        { type: "uint256", value: values.proposalId.toString() },
        { type: "address", value: values.voterAddress },
        { type: "uint8", value: voteType.toString() },
        { type: "uint256[]", value: nonces.toString() }
    )
}
