let _COS: any = null

async function getCOS() {
  if (!_COS) {
    const mod = await import("cos-nodejs-sdk-v5")
    const COSClass = mod.default || mod
    _COS = new COSClass({
      SecretId: process.env.TX_SECRET_ID || "",
      SecretKey: process.env.TX_SECRET_KEY || "",
    })
  }
  return _COS
}

const BUCKET = process.env.TX_COS_BUCKET || ""
const REGION = process.env.TX_COS_REGION || "ap-guangzhou"

export async function uploadToCOS(
  key: string,
  body: Buffer,
  contentType?: string
): Promise<string> {
  const cos = await getCOS()
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      (err: Error | null) => {
        if (err) reject(err)
        else resolve(`https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`)
      }
    )
  })
}

export async function deleteFromCOS(key: string): Promise<void> {
  const cos = await getCOS()
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
      },
      (err: Error | null) => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

export function getCOSKeyFromUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.pathname.slice(1)
  } catch {
    return ""
  }
}
