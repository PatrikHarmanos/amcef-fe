import { useState, FC } from 'react';

// mui components
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import contactService from '../services/contactService';
import { useTranslation } from "react-i18next";
import { Contact } from '../interfaces/Contact';

interface EditModalProps {
    contact: Contact;
    reload: () => void;
    onClose: () => void;
    open: boolean;
}

type FormValues = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    note: string;
};

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phoneNumber: yup.string().required(),
    email: yup.string().email().required(),
    address: yup.string().required(),
    note: yup.string().required()
}).required();

const EditModal: FC<EditModalProps> = ({ contact, reload, onClose, open }: EditModalProps) => {
    const [id] = useState<number>(contact.id);
    const [firstName, setFirstName] = useState<string>(contact.firstName);
    const [lastName, setLastName] = useState<string>(contact.lastName);
    const [number, setNumber] = useState<string>(contact.phoneNumber);
    const [email, setEmail] = useState<string>(contact.email);
    const [address, setAddress] = useState<string>(contact.address);
    const [note, setNote] = useState<string>(contact.note);
    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const save = handleSubmit(() => {
        const user: Contact = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: number,
            email: email,
            address: address,
            note: note
        }
        contactService
            .editContact(user, user.id)
            .then((res) => {
                reload()  
                onClose()     
            })
            .catch(() => {});
    });

    return (
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className='editModal'>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {t('editTitle')}
            </Typography>
            <Box component="form" onSubmit={save} noValidate sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="firstName"
                    label={t('firstName')}
                    {...register("firstName")}
                    onChange={e => setFirstName(String(e.target.value))}
                    defaultValue={contact.firstName}
                />
                {errors?.firstName && <p className='form-error'>{errors.firstName.message}</p>}
                <TextField
                    fullWidth
                    margin="normal"
                    id="lastName"
                    label={t('lastName')}
                    {...register("lastName")}
                    onChange={e => setLastName(String(e.target.value))}
                    defaultValue={contact.lastName}
                />
                {errors?.lastName && <p className='form-error'>{errors.lastName.message}</p>}
                <TextField
                    fullWidth
                    margin="normal"
                    id="number"
                    label={t('phoneNumber')}
                    {...register("phoneNumber")}
                    onChange={e => setNumber(String(e.target.value))}
                    defaultValue={contact.phoneNumber}
                />
                {errors?.phoneNumber && <p className='form-error'>{errors.phoneNumber.message}</p>}
                <TextField
                    fullWidth
                    id="email"
                    margin="normal"
                    label={t('email')}
                    {...register("email")}
                    onChange={e => setEmail(String(e.target.value))}
                    defaultValue={contact.email}
                />
                {errors?.email && <p className='form-error'>{errors.email.message}</p>}
                <TextField
                    fullWidth
                    id="address"
                    label={t('address')}
                    {...register("address")}
                    margin="normal"
                    onChange={e => setAddress(String(e.target.value))}
                    defaultValue={contact.address}
                />
                {errors?.address && <p className='form-error'>{errors.address.message}</p>}
                <TextField
                    fullWidth
                    id="note"
                    margin="normal"
                    label={t('note')}
                    {...register("note")}
                    onChange={e => setNote(String(e.target.value))}
                    defaultValue={contact.note}
                />
                {errors?.note && <p className='form-error'>{errors.note.message}</p>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {t('editButton')}
                </Button>
            </Box>
          </Box>
        </Modal>
    );
}

export default EditModal;