'use client'

import { addNewUserAction } from "@/actions";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addNewFormControls, addNewUserFormInitialState } from "@/utils";
import { useState } from "react";

const AddNewUser = () => {

    const [openPopup, setOpenPopup] = useState(false);
    const [addNewUserFormData, setAddNewUserFormData] = useState(addNewUserFormInitialState);

    console.log("addNewUserFormData", addNewUserFormData);

    /**
     * Kiểm tra các trường trong addNewUserFormData có giá trị
     * Nếu trả về false tức là có giá trị rỗng
     * Nếu trả về true tức là các trường đều có giá trị
     * Hàm này trả về true hoặc false
     */
    const handleSaveButtonValid = () => {
        return Object.keys(addNewUserFormData).every((key) => addNewUserFormData[key].trim() !== '')
    }

    const handleAddNewUserAction = async () => {
        const result = await addNewUserAction(addNewUserFormData);
        console.log(result);
    }

    return (
        <div>
            <Button onClick={() => setOpenPopup(true)}>Add New User</Button>
            <Dialog open={openPopup} onOpenChange={() => {
                setOpenPopup(false);
                setAddNewUserFormData(addNewUserFormInitialState);
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form action={handleAddNewUserAction} className="grid gap-4 py-4">
                        {
                            addNewFormControls.map((controlItem) => (
                                <div className="mb-5" key={controlItem.name}>
                                    <Label htmlFor={controlItem.name} className="text-right">
                                        {controlItem.label}
                                    </Label>
                                    <Input
                                        id={controlItem.name}
                                        name={controlItem.name}
                                        placeholder={controlItem.placeholder}
                                        className="col-span-3"
                                        type={controlItem.type}
                                        value={addNewUserFormData[controlItem.name]}
                                        onChange={(event) => 
                                            setAddNewUserFormData({
                                                ...addNewUserFormData,
                                                [controlItem.name]: event.target.value
                                            })
                                        }
                                    />
                                </div>
                            ))
                        }
                        <DialogFooter>
                            <Button 
                                type="submit" 
                                className="disabled:opacity-55 w-full" 
                                disabled={!handleSaveButtonValid()}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewUser;