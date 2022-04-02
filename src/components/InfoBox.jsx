import React from 'react'
import { Card, Typography } from "@mui/material"

const cardStyle = {
  p: 1,
  boxShadow: 0,
  border: "1px solid",
  borderColor: "divider",
  color: "text.secondary",
}

export default function InfoBox({text}) {
  return (
    <Card sx={cardStyle}>
      <Typography textAlign="center">
        {text}
      </Typography>
    </Card>
  )
}
