const service = require("../service/service")


module.exports.getPdf = async (req, res) => {

    const pdf = req.body.pdf;

    if (!pdf) {
        return res.status(400).send("Prompt is required");
    }

    const response = await service(pdf);


    res.send(response);

}