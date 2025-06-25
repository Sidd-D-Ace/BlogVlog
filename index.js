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

// renders the post form page
app.post('/post',(req,res)=>{
    res.render('postLayout.ejs');
})

// renders the post form page but with selected post content
app.post('/edit',(req,res)=>{
    let editPostName=req.body['element'];          //retrive the name of the post
    let editPostmessage;
    fs.readFile(__dirname+'/PostsFile/'+editPostName+'post.txt','utf-8',(err,data)=>{
        if (err) throw err;
        console.log(`Successfully Read ${editPostName} Content`);
        editPostmessage=data;
        res.render('postLayout.ejs',{name:editPostName, message:editPostmessage});   //renders the page here becoz readFile func does store the data outside of the function
    });
})

//handle teh sub,it request to save the post 
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


//Handle the submit request of edited post
app.post('/edit-post',(req,res)=>{
    let postName=req.body['editname'];
    let postContent=req.body['editmessage'];
    fs.writeFile(`PostsFile/${postName}post.txt`,postContent,(err)=>{
        if (err) throw err;
        console.log(`Post Saved as ${postName}post.txt`);
    })
    res.redirect('/');
})


app.post('/delete',(req,res)=>{
    let deletePostName=req.body['element']; 
    let postIdx=postArr.indexOf(deletePostName);
    postArr.splice(postIdx,1);
    fs.unlink(`PostsFile/${deletePostName}post.txt`,(err)=>{
        if (err) throw err;
        console.log(`${deletePostName} Deleted Successfully`);
    })
    res.redirect('/');
})

//renders the view post page 
app.post('/view-post',(req,res)=>{
    let viewPostName=req.body['element'];
    fs.readFile(__dirname+'/PostsFile/'+viewPostName+'post.txt','utf-8',(err,data)=>{
        if (err) throw err;
        res.render('view-post.ejs',{ page: 'view-post',name:viewPostName,message:data});
    })
})

app.listen(port,()=>{
    console.log(`Listening on ${port}`);
})