import styled from 'styled-components';

export const Form = styled.form`
background-color: transparent;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 0 15px;
height: 100%;
text-align: center;
`;

export const Title = styled.h1`
font-weight: bold;
margin: 0;
`;

export const Input = styled.input`
background-color: #FFF;
border: none;
padding: 12px 15px;
margin: 8px 0;
width: 100%;
`;

export const inlineData = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const HalfInput = styled.input`
background-color: #eee;
border: none;
padding: 12px 15px;
margin: 10px;
`;

export const HalfInputPassword = styled.input`
background-color: #eee;
font-family: 'password';
border: none;
padding: 12px 15px;
margin: 10px;
`;


export const Button = styled.button`
   border-radius: 20px;
   border: 1px solid #734ebb;
   background-color: #734ebb;
   color: #ffffff;
   font-size: 12px;
   font-weight: bold;
   padding: 12px 45px;
   letter-spacing: 1px;
   text-transform: uppercase;
   transition: transform 80ms ease-in;
   &:active{
       transform: scale(0.95);
   }
   &:focus {
       outline: none;
   }
`;