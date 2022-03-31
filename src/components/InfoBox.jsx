import React from 'react'
import { Card, Typography } from "@mui/material"

export default function InfoBox({text}) {
  return (
    <Card sx={{
        p: 1,
        boxShadow: 0,
        border: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
      }}
    >
      <Typography textAlign="center">
        {text}
      </Typography>
    </Card>
  )
}
