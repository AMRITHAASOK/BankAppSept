//import jsonwebtoken

const jwt = require('jsonwebtoken');

//import db.js
 const db=require('./db')

// userDetails={
//     1000:{acno:1000,username:"Amal",password:1000,balance:2000,transaction:[]},
//     1001:{acno:1001,username:"Arun",password:1001,balance:2000,transaction:[]},
//     1002:{acno:1002,username:"Akshay",password:1002,balance:2000.,transaction:[]},
//   }

 const register=(acno,username,password)=>{
  return db.User.findOne({acno}).then(//asynchorous call 
    user=>{
      if(user){
        return{
          status:false,
          statusCode:401,
          message:"User already registered"
        }
      }
      else{
        const newUser= new db.User({
          acno:acno,
          username:username,
          password:password,
          balance:0,
          transaction:[]
        })
        newUser.save()//to save new data to mongodb
        return  {
          status:true,
          statusCode:200,
          message:"Register successful"
        }
      }
    }
  )

    if(acno in userDetails){
    return {
        status:false,
        statusCode:401,
        message:"User already exists"

    }
    }
    else{
      userDetails[acno]={
        acno:acno,
        username:username,
        password:password,
        balance:0,
        transaction:[]
      }
      
      return  {
        status:true,
        statusCode:200,
        message:"Register successful"

    }
     }
     }
   const login=(acno,password)=>{
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          currentUser=user.username;
          currentAcno=acno
          //token generation
          const token=jwt.sign({currentAcno:acno},'superkey2023')
          //superkey2023 will generate a number eg hlvfevfivpev7f9e8vfe0vevg
          return  {
            status:true,
            statusCode:200,
            message:"Login successful",
            token:token,
            currentUser:user.username,
            currentAcno:acno
        }
        }
        else{
          return {
            status:false,
            statusCode:401,
            message:"invalid userdetails"

        }
      }
      }
    )

      if(acno in userDetails){
          if(pswd==userDetails[acno]['password']){
            currentUser=userDetails[acno]['username'];
            currentAcno=acno
            //token generation
            const token=jwt.sign({currentAcno:acno},'superkey2023')
            //superkey2023 will generate a number eg hlvfevfivpev7f9e8vfe0vevg
            return  {
              status:true,
              statusCode:200,
              message:"Login successful",
              token:token

      
          }
          }
          else{
            return {
              status:false,
              statusCode:401,
              message:"Invalid password"
      
          }

        }
      }
        else{
         return {
          status:false,
          statusCode:401,
          message:"invalid userdetails"
  
      }
        }
     }



    const deposit=(acno,password,amt)=>{
      var amount=parseInt(amt)
      return db.User.findOne({acno,password}).then(
        user=>{
          if(user){
            if(password==user.password){
             user.balance += amount;
              user.transaction.push({
                type:'Credit',
                amount
              })
              // console.log(user);
              // console.log(balance);
              user.save();//save to mongodb
              return  {
                status:true,
                statusCode:200,
                message:`${amount} is credited and balance is ${user.balance}`,
               
            }
            }
            else{
              return {
                status:false,
                statusCode:401,
                message:"invalid password"
        
            }
            }
          }
          else{
            return {
              status:false,
              statusCode:401,
              message:"invalid userdetails"
      
          }
        }
        }
      )
      
      

    }

   const withdraw=(acno, password,amt)=>{
      var amount=parseInt(amt)
      return db.User.findOne({acno,password}).then(
        user=>{
          if(user){
            if(password==user.password){
             user.balance -= amount;
              user.transaction.push({
                type:'Debit',
                amount
              })
              user.save();//save to mongodb
              return  {
                status:true,
                statusCode:200,
                message:`${amount} is debited and balance is ${user.balance}`
            }
            }
            else{
              return {
                status:false,
                statusCode:401,
                message:"invalid password"
        
            }
            }
          }
          else{
            return {
              status:false,
              statusCode:401,
              message:"invalid userdetails"
      
          }
        }
        }
      )
      

      if(acno in userDetails){
        if(pswd==userDetails[acno]['password']){
          if(userDetails[acno]['balance']>amount){
            userDetails[acno]['balance'] -= amount;
            userDetails[acno]['transaction'].push({
              type:'Debit',
              amount
            })
     
            return {
              status:true,
              statusCode:200,
              message:`${amount} is debited and balance is ${userDetails[acno]['balance']}`
          }
            
          }
        }
        else{
          return {
            status:false,
            statusCode:401,
            message:"invalid password"
    
        }
        }
     }
     else{
      return {
        status:false,
        statusCode:401,
        message:"invalid userdetails"

    }
     }
    }

  const getTransaction=(acno)=>{
    return db.User.findOne({acno}).then(
      user=>{
        if(user){
          return {
            status:true,
            statusCode:200,
            transaction:user.transaction
        }
        }
        else{
          return {
            status:false,
            statusCode:401,
            message:"User not found"
           
        }
        }
      }
    )

     return {
      status:true,
      statusCode:200,
      transaction:userDetails[acno]['transaction']
  }
    }

//delete account

const deleteAcc=(acno)=>{

 return db.User.findOneAndDelete({acno}).then(
    user=>{
      if(user){
        return {
          status:true,
          statusCode:200,
          message:"User deleted"
      }
      }
      else{
        return {
          status:false,
          statusCode:401,
          message:"User not found"
      }
      }
    }
  )
}


     module.exports={
        register,
        login,
        deposit,
        withdraw,
        getTransaction,
        deleteAcc


     }