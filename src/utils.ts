function printSecondsElapsed(start: number) {
    const now = Date.now();
    let diff = (now - start);
    diff /= 1000;
    const seconds = Math.round(diff);
    console.log('Seconds elapsed:', seconds);
}
