const errorHandeler = (err, req, res, next) =>{
      if(err?.message){
            res.status(500).send(err.message)
      }
      else{
            res.status(500).send("There was an error")
      }
}


module.exports =errorHandeler