//importando libs
const express = require('express')
const nunjucks = require('nunjucks')

server = express()

//configurando servidor para arquivos estáticos
server.use(express.static("public"))

//habilitar body do req
server.use(express.urlencoded({extended: true}))

//configurar a conexão com o BD
const Pool = require('pg').Pool
const db = new Pool({
  user: 'login', // seu user do BD
  password: 'senha', // sua senha do BD
  host: 'localhost',
  port: 5432,
  database: 'bancoDeDados' // nome do BD
})


//configurando template engine 
nunjucks.configure("./", {
  express: server,
  noCache: true,
})



//configurando rotas
server.get('/', (req, res) => {
  
  db.query(`SELECT * FROM donors`, (err, result) => {
    if(err){
      res.send(err)
    }
    const donors = result.rows
    const lastDonors = []
    // for (let i = donors.length - 4; i<donors.length; i++){
    //   lastDonors.push(donors[i])
    // }
    for (let i = -4; i<0; i++){
      lastDonors.push(donors[donors.length + i])
    }
    console.log(lastDonors)
    res.render("index.html", {lastDonors})
  })
})

server.post('/', (req,res) => {
  //pegar dados do formulário
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood
  
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios")
  }  
  //inserir valores dentro do BD
  const query = `INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3) `
  
  const values = [name, email, blood]

  db.query(query, values, (err)=>{
    if (err) return res.send("Erro no Banco de Dados")
    return res.redirect("/")
  })
})

// iniciando o servidor, ouvindo em uma porta
server.listen(3000, ()=>{
  console.log(`server is listening on port 5000`)
})