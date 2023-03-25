
export function printT(size: number) {
  if (size % 2 === 0 || size < 3) {
    console.log("Invalid input. Size must be an odd number greater than or equal to 3.");
    return;
  }

  const upper = "T".repeat(size);
  const whitespace = " ".repeat(Math.floor(size / 2)); // Since size is odd, wee need to floor it to get the correct number of spaces on each side of the T

  let t = upper + "\n"; // Add the top of the T
  // Add the 
  for (let i = 1; i <= Math.floor(size / 2); i++) {
    t += whitespace + "T\n";
  }

  console.log(t);
}