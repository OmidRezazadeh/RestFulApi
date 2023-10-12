exports.home = (req, res) => {
  res.status(200).json({ toplearn: "Hello blog m" });
};

exports.store =(req,res)=>{
     console.log(req.body);
     res.send(req.body);
}
