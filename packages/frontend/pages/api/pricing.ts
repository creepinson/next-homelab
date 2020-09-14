// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const service = req.query.service as string;

        switch (service.toLowerCase()) {
            case "heimsnet":
                const { $, error, code } = await loadURL(
                    "https://www.heimsnet.eu/game-cloud/",
                );
                if (error)
                    return res.status(code).json({ error, status: code });
                const titles = $(".gyan-pricing-table-title")
                    .toArray()
                    .map((e) => $(e).text());
                const prices = $(".gyan-pricing-table-price-value")
                    .toArray()
                    .map((e) => $(e).text());
                const pricing = titles.map((t, i) => ({
                    plan: t,
                    unit: "€",
                    price: prices[i],
                }));
                res.status(200).json({ pricing });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loadURL = async (
    url: string,
): Promise<{
    $: CheerioStatic;
    error?: Error;
    code: number;
}> => {
    let $ = null;
    let code = 200;
    try {
        const response = await fetch(url, { mode: "cors" });
        code = response.status;

        if (response.status === 200) {
            const html = await response.text();
            $ = cheerio.load(html);
            return { $, error: null, code };
        } else {
            throw new Error("Invalid response status code - expected 200.");
        }
    } catch (error) {
        return { $, error: error.message, code };
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};
