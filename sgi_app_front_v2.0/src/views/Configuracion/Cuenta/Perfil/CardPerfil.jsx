import * as React from 'react';
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
import { Badge } from '@mui/joy';
import icons from '../../../../Icons/IconLibrary';
export default function BioCard() {
  return (
    <Card
      sx={{
        width: 400,
        height: 400,
        maxWidth: '100%',
        boxShadow: 'lg',
      }}
    >
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Badge
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="plain"
        badgeContent={
            <IconButton>
                {icons.edit}
            </IconButton>
        }
        badgeInset="14%"
        sx={{ '--Badge-paddingX': '0px' }}
      >
        <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '8rem' }} />
      </Badge>
        <Chip
          size="sm"
          variant="soft"
          color="primary"
          sx={{
            mt: -1,
            mb: 1,
            border: '3px solid',
            borderColor: 'background.surface',
          }}
        >
          CARGO
        </Chip>
        <Typography level="title-lg">Josephine Blanton</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
          Hola, soy empleado x, puesto x, de la empresa x.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            '& > button': { borderRadius: '2rem' },
          }}
        >
          <IconButton size="sm" variant="plain" color="neutral">
            {icons.age}
            <Typography>Edad</Typography>
          </IconButton>
          <IconButton size="sm" variant="plain" color="neutral">
              {icons.date}
            <Typography>Fecha de alta</Typography>
          </IconButton>
          <IconButton size="sm" variant="plain" color="neutral">
            {icons.genderEquality}
            <Typography>Sexo</Typography>
          </IconButton>
        </Box>
      </CardContent>
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
            <Button>
                {icons.phoneTwoColor}
                Telefono
            </Button>
            <Button>
                {icons.emailTwoColor}
                Correo
            </Button>
          </ButtonGroup>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
