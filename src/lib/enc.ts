import crypto from "crypto"

const ENC_KEY = Buffer.from(process.env.ENC_KEY!, "hex");
const IV_LENGTH = 16;

export function encrypt(text : string) : string {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(data : string) : string {
    const [ivHex, cipherHex] = data.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(cipherHex, "hex");

    const decipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString("utf-8");

}