import React from "react";
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import BioCard from "./CardPerfil";
import AboutMe from "./AboutMe";
import { Grid } from "@mui/joy";
import './Perfil.css'

const Perfil = () => {
  return <Grid container spacing={2} className='PerfilContainer'>
    <Grid item xs={4}>
        <BioCard/>
    </Grid>
    <Grid item xs={8}>
        <AboutMe/>
    </Grid>
  </Grid>
};

export default Perfil;
