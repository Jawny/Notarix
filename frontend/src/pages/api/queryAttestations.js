import { IndexService } from "@ethsign/sp-sdk";
import { decodeSignData } from "@/lib/utils";

export default async function handler(req, res) {
  try {
    const { attestor_id, schema_id, schema } = req.query;
    const indexService = new IndexService("testnet");

    const response = await indexService.queryAttestationList({
      schemaId: schema_id, // Your full schema's ID
      //attester: attestor_id, // Alice's address
      page: 1,
      mode: "onchain", // Data storage location
    });

    const decodedResponse = response.rows.map((row) => {
      return {
        id: row.id,
        date: row.attestTimestamp,
        ...decodeSignData(row.data, schema),
      };
    });

    console.log(response);

    //console.log(decodedResponse);

    return res.status(200).json({ success: true, data: decodedResponse });
  } catch (error) {
    console.log("WE FAILED", error);
    return res.status(400).json({
      success: false,
      data: null,
    });
  }
}
