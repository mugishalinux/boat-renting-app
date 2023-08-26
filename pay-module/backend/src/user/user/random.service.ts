import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomNumberService {
  generateCardNumber(): string {
    const characters = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomNumber += characters[randomIndex];
    }
    return randomNumber;
  }

  generateCvvNumber(): string {
    const characters = "0123456789";
    let randomNumber = "";
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomNumber += characters[randomIndex];
    }
    return randomNumber;
  }

  generateExpirationDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    return `${month}/${year}`;
  }
}
