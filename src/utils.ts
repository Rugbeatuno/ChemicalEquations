
// 1. All non-zero numbers ARE significant. The number 33.2 has THREE significant figures because all of the digits present are non-zero.
// 2. Zeros between two non-zero digits ARE significant. 2051 has FOUR significant figures. The zero is between a 2 and a 5.
// 3. Leading zeros are NOT significant. They're nothing more than "place holders." The number 0.54 has only TWO significant figures. 0.0032 also has TWO significant figures. All of the zeros are leading.
// 4. Trailing zeros to the right of the decimal ARE significant. There are FOUR significant figures in 92.00.
// 92.00 is different from 92: a scientist who measures 92.00 milliliters knows his value to the nearest 1/100th milliliter; meanwhile his colleague who measured 92 milliliters only knows his value to the nearest 1 milliliter. It's important to understand that "zero" does not mean "nothing." Zero denotes actual information, just like any other number. You cannot tag on zeros that aren't certain to belong there.
// 5. Trailing zeros in a whole number with the decimal shown ARE significant. Placing a decimal at the end of a number is usually not done. By convention, however, this decimal indicates a significant zero. For example, "540." indicates that the trailing zero IS significant; there are THREE significant figures in this value.
// 6. Trailing zeros in a whole number with no decimal shown are NOT significant. Writing just "540" indicates that the zero is NOT significant, and there are only TWO significant figures in this value.
// 7. Exact numbers have an INFINITE number of significant figures. This rule applies to numbers that are definitions. For example, 1 meter = 1.00 meters = 1.0000 meters =
// 1.0000000000000000000 meters, etc.
export const countSigFigs = (num: number): number => {
    let sigFigs = 0;

    let numString = num.toString();
    let containsDot = numString.indexOf(".") > -1;

    // remove trailing zeros
    let numString2 = num.toString()
    while (true) {
        if (numString2.length > 0 && numString2.charAt(0) === "0") {
            numString2.slice(1, -1);
        } else {
            break;
        }
    }

    // if there is a decimal point then return len-1
    if (containsDot) {
        return numString2.length - 1;
    }

   // precompute digit locations
   let digitLocs = [];
   for (let i=0; i<numString2.length; i++) {
    let digitAsString: string = numString2.charAt(i);
    if (digitAsString !== "." && digitAsString !== "0") {
        digitLocs.push(i)
        sigFigs++;
    }
}

    // since all leading zeros are removed, we can assume the there already is a number in front of the zero
    for (let i=0; i<numString2.length; i++) {
        let digitAsString: string = numString2.charAt(i);
        if (digitAsString === "0") {
            for (let idx of digitLocs) {
                if (idx > i) {
                    sigFigs++;
                    break;
                }
            }
        }
    }


    return sigFigs;
}