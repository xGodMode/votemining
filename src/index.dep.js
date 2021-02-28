// First implementation. For posterity!

function recurse(nonces, slice, found) {
  if (found) {
    return nonces;
  }

  if (slice.length > 1) {
    for (let j = 0; j < Number.MAX_SAFE_INTEGER; j++) {
      const foundNonces = recurse(nonces, slice.slice(1), false)
      if (foundNonces) break;
      nonces[slice.length - 1] = j;
    }
    return foundNonces;
  } else {
    let match = false;
    let list;
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      list = nonces;
      list[-1] = i;
      const hash = getHash(values, list);
      if (hash == givenHash) {
        match = true;
        break;
      }
    }
    return (match) ? list : null;
  }
}