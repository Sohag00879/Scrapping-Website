import Query from "../models/query.js"; 

export const addQuery = async (req, res) => {
  try {
    const querySearch = req.params.query;

    await Query.create({
      query: [querySearch],
    });

    res.status(201).json({
      success: true,
      message: "Query Saved Successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
