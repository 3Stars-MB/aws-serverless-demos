import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const s3Client = new S3Client({});
const snsClient = new SNSClient({});

async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

export const handler = async (event, context) => {
  console.log("Evento recebido:", JSON.stringify(event, null, 2));

  try {
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(getObjectCommand);

    const fileContent = await streamToString(response.Body);

    const snsParams = {
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: `Novo arquivo em ${bucket}`,
      Message: `O arquivo "${key}" foi adicionado ao bucket.\n\nConteúdo:\n${fileContent}`,
    };

    await snsClient.send(new PublishCommand(snsParams));

    console.log(`Notificação enviada com sucesso para SNS (${process.env.SNS_TOPIC_ARN})`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Notificação enviada com sucesso!",
        file: key,
      }),
    };
  } catch (error) {
    console.error("Erro ao processar o evento:", error);
    throw new Error(`Falha ao processar arquivo: ${error.message}`);
  }
};