import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';


const app=express();
const port=3000;
const __dirname=dirname(fileURLToPath(import.meta.url));
let postArr=[];

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index.ejs',{postArr});
})

app.post('/post',(req,res)=>{
    res.render('postLayout.ejs');
})

app.post('/edit',(req,res)=>{
    console.log(req.body)
    // let editPostName=req.body['element']
    res.render('postLayout.ejs',{})
})

app.post('/submit-post',(req,res)=>{
    let postName=req.body['name'];
    let postContent=req.body['message'];
    fs.writeFile(`PostsFile/${postName}post.txt`,postContent,(err)=>{
        if (err) throw err;
        console.log(`Post Saved as ${postName}post.txt`);
    })
    postArr.push(postName);
    res.redirect('/');
})



app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})