import COS from "cos-nodejs-sdk-v5"

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID || "",
  SecretKey: process.env.COS_SECRET_KEY || "",
})

const BUCKET = process.env.COS_BUCKET || ""
const REGION = process.env.COS_REGION || "ap-guangzhou"

export async function uploadToCOS(
  key: string,
  body: Buffer,
  contentType?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      (err) => {
        if (err) reject(err)
        else resolve(`https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`)
      }
    )
  })
}

export async function deleteFromCOS(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
      },
      (err) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

export function getCOSKeyFromUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.pathname.slice(1) // Remove leading /
  } catch {
    return ""
  }
}