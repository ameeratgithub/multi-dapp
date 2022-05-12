import { Paper, Stack, TextField, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { useState } from "react"

const MintingPaper = styled(Paper)({
    position: 'absolute',
    top: '15%',
    left: '25%',
    padding: '20px 30px',
    width: '50%'
})

export default () => {
    const [name, setName] = useState('')
    const [nameErr, setNameErr] = useState(false)
    
    const [description, setDescription] = useState('')
    const [descriptionErr, setDescriptionErr] = useState(false)

    const validate = (value, callback) => {
        if (!value) callback(true)
        else callback(false)
    }

    const handleName = e => {
        const input = e.target.value
        validate(input, setNameErr)
        setName(input)
    }
    const handleDescription = e => {
        const input = e.target.value
        validate(input, setDescriptionErr)
        setDescription(input)
    }

    
    return <MintingPaper>
        <form>
            <Stack spacing={2}>
                <Typography variant="h5">
                    Mint Your Own NFT
                </Typography>
                <TextField
                    error={nameErr}
                    helperText={nameErr && "Name is required"}
                    required
                    id="outlined-required"
                    label="Name"
                    value={name}
                    onChange={handleName}
                />
                <TextField
                    error={descriptionErr}
                    helperText={descriptionErr && "Description is required"}
                    required
                    id="outlined-required"
                    label="Description"
                    value={description}
                    onChange={handleDescription}
                />
            </Stack>
        </form>
    </MintingPaper>
}