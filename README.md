This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Server Actions : https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Server Actions cho phép Client Components gọi các hàm không đồng bộ được thực thi trên server.

## Làm cách nào để xây dựng hỗ trợ cho Server Actions?
- Mặc dù HServer Actions trong React 19 ổn định và sẽ không bị hỏng giữa các phiên bản chính, nhưng các API cơ bản được sử dụng để triển khai Server Actions trong framework hoặc React Server Components bundler không tuân theo ngữ nghĩa và có thể bị hỏng giữa các phiên bản phụ trong React 19.x.

- Để hỗ trợ Server Actions dưới dạng bundler hoặc framework, chúng tôi khuyên bạn nên ghim vào một phiên bản React cụ thể hoặc sử dụng bản phát hành Canary. Chúng tôi sẽ tiếp tục làm việc với các bundler và framework để ổn định các API được sử dụng để triển khai Server Actions trong tương lai.

- Khi Server Actions được xác định bằng lệnh "use server", framework của bạn sẽ tự động tạo tham chiếu đến chức năng máy chủ và chuyển tham chiếu đó đến Client Component. Khi hàm đó được gọi trên client, React sẽ gửi yêu cầu đến server để thực thi hàm và trả về kết quả.

- Server Actions có thể được tạo trong Server Components và được chuyển dưới dạng props cho Client Components hoặc chúng có thể được nhập và sử dụng trong Client Components.

## Bình thường khi call api trong server component ta có

```jsx
const fetchListOfProducts = async () => {
    const res = await fetch('https://dummyjson.com/products');
    const data = await res.json();

    return data?.products
}

const ServerActionsExample = async () => {

    const products = await fetchListOfProducts()
    console.log("products", products);

    return (
        <div>
            <h1>Server actions example - server components</h1>
        </div>
    )
}

export default ServerActionsExample
```

- Nhưng nếu áp dụng Server Actions thì phải sửa lại và nó cũng sẽ cho ra kết quả tương tự

```jsx
const ServerActionsExample = async () => {

    const fetchListOfProducts = async () => {
        'use server'
        const res = await fetch('https://dummyjson.com/products');
        const data = await res.json();
    
        return data?.products
    }

    const products = await fetchListOfProducts()
    console.log("products", products);

    return (
        <div>
            <h1>Server actions example - server components</h1>
        </div>
    )
}

export default ServerActionsExample
```

## Server Components

- Server Components có thể sử dụng lệnh "use server" ở cấp độ chức năng nội tuyến hoặc cấp mô-đun. Để nội tuyến một Server Action, hãy thêm "use server" vào đầu nội dung hàm:

```jsx
// Server Component
export default function Page() {
  // Server Action
  async function create() {
    'use server'
 
    // ...
  }
 
  return (
    // ...
  )
}
```

## Client Components

- Client Components chỉ có thể nhập các hành động sử dụng lệnh "use server" cấp mô-đun.

- Để gọi Server Action trong Client Components, hãy tạo một tệp mới và thêm lệnh "use server" ở đầu tệp. Tất cả các chức năng trong tệp sẽ được đánh dấu là Server Actions có thể được sử dụng lại trong cả Client và Server Components:

- app/action.ts

```tsx
'use server'
 
export async function create() {
  // ...
}
```

- app/ui/button.tsx

```tsx
import { create } from '@/app/actions'
 
export function Button() {
  return (
    // ...
  )
}
```

## Cách thứ 2 nếu ta phải call api ở cả client component và server component trong dự án

- B1: Tạo 1 thư mục actions có file index.js (bên trong thư mục src và cùng cấp với thự mục app) 

```jsx
'use server'

export const fetchListOfProducts = async () => {
    const res = await fetch('https://dummyjson.com/products');
    const data = await res.json();

    return data?.products
}
```

- B2: Import

```jsx
import { fetchListOfProducts } from "@/actions";

const ServerActionsExample = async () => {
    const products = await fetchListOfProducts()
    console.log("products", products);

    return (
        <div>
            <h1>Server actions example - server components</h1>
            <ul>
                {
                    products && products.length > 0 ?
                        products.map((item) => (
                            <li key={item.id}>
                                <p>{item.title}</p>
                            </li>
                        ))
                        : (
                            <h2>No product found</h2>
                        )
                }
            </ul>
        </div>
    )
}

export default ServerActionsExample;
```

- Ở Client component

```jsx
'use client'

import { fetchListOfProducts } from '@/actions'
import React, { useEffect, useState } from 'react'

const ClientPageExample = () => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const getListOfProducts = async () => {
        setLoading(true)
        const data = await fetchListOfProducts();
        console.log(data);
        if(data) {
            setProducts(data)
            setLoading(false)
        }
    }

    useEffect(() => {
        getListOfProducts()
    }, [])

    if(loading) return <h1>Loading data! Please wait</h1>

    return (
        <div>
            <h1>Client page server actions example</h1>
            <ul>
                {
                    products && products.length > 0 ?
                        products.map((item) => (
                            <li key={item.id}>
                                <p>{item.title}</p>
                            </li>
                        ))
                        : (
                            <h2>No product found</h2>
                        )
                }
            </ul>
        </div>
    )
}

export default ClientPageExample
```

### Thực hành Server Component

- B1: Tải shadcn/ui
- B2: Tạo thư mục add-new-user bên trong thư mục components được tạo 
- B3: Tạo file index.js bên trong và chỉnh sửa

```jsx

const AddNewUser = () => {

    const [openPopup, setOpenPopup] = useState(false)
    return (
        <div>
            <Button onClick={() => setOpenPopup(true)}>Add New User</Button>
            <Dialog open={openPopup} onOpenChange={setOpenPopup}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue="Pedro Duarte"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue="@peduarte"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewUser;
```

- B4: Tạo thư mục utils (bên trong thư mục src) và file index.js bên trong nó

```jsx
export const addNewFormControls = [
    {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter your first name',
        type: 'input'
    },
    {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        type: 'input'
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        type: 'email'
    },
    {
        name: 'address',
        label: 'Address',
        placeholder: 'Enter your address',
        type: 'input'
    }
]
```

- B5: Sửa lại dialog

```jsx
import { addNewFormControls } from "@/utils";

const AddNewUser = () => {

    const [openPopup, setOpenPopup] = useState(false)
    return (
        <div>
            <Button onClick={() => setOpenPopup(true)}>Add New User</Button>
            <Dialog open={openPopup} onOpenChange={setOpenPopup}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewUser;
```

- B6: Bổ sung ở utils

```jsx
export const addNewUserFormInitialState = {
    firstName: '',
    lastName: '',
    email: '',
    address: ''
}
```

- B7: Bổ sung state:

```jsx
const [addNewUserFormData, setAddNewUserFormData] = useState(addNewUserFormInitialState);
```

- B8: Sửa lại Input

```jsx
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
```

- B9: Sửa lại khi đóng mở Popup

- Ban đầu

```jsx
<Dialog open={openPopup} onOpenChange={setOpenPopup}></Dialog>
```

- Sửa lại

```jsx
<Dialog open={openPopup} onOpenChange={() => {
    setOpenPopup(false);
    setAddNewUserFormData(addNewUserFormInitialState);
}}></Dialog>
```

### Giải thích về:  Object.keys(addNewUserFormData).map((key) => addNewUserFormData[key].trim() !== '')

- Đoạn mã này sẽ kiểm tra từng giá trị trong đối tượng addNewUserFormData để xem liệu chúng có phải là chuỗi không rỗng sau khi đã được trim hay không. Hãy cùng giải thích chi tiết từng phần của đoạn mã này:

- Object.keys(obj): Trả về một mảng chứa tất cả các khóa (key) của đối tượng obj. Trong trường hợp này, nó trả về một mảng chứa tất cả các khóa của đối tượng addNewUserFormData.
- .map((key) => ...)
.map(callback): Phương thức map của mảng gọi hàm callback cho mỗi phần tử trong mảng và trả về một mảng mới chứa kết quả của từng lời gọi hàm callback. Trong trường hợp này, callback là một hàm mũi tên (key) => ....
- addNewUserFormData[key].trim() !== ''
- addNewUserFormData[key]: Lấy giá trị của thuộc tính có khóa là key từ đối tượng addNewUserFormData.
- .trim(): Phương thức trim loại bỏ khoảng trắng từ đầu và cuối của chuỗi.
- !== '': Kiểm tra xem chuỗi đã được trim có khác rỗng hay không. Nếu khác rỗng, biểu thức này sẽ trả về true, ngược lại trả về false.

# Kết Quả
- Hàm này sẽ trả về một mảng các giá trị boolean. Mỗi phần tử trong mảng tương ứng với một khóa trong đối tượng addNewUserFormData. Nếu giá trị của thuộc tính đó không phải là chuỗi rỗng sau khi trim, giá trị tương ứng trong mảng sẽ là true, ngược lại sẽ là false.

# Ví Dụ
- Giả sử bạn có đối tượng addNewUserFormData như sau:

```jsx
const addNewUserFormData = {
    username: ' john_doe ',
    email: 'john@example.com',
    password: ' ',
    confirmPassword: 'password123'
};
```

- Khi gọi đoạn mã trên
```jsx
const result = Object.keys(addNewUserFormData).map((key) => addNewUserFormData[key].trim() !== '');
console.log(result); // [true, true, false, true]
```

## Sử Dụng Trong Thực Tế
- Nếu mục tiêu của bạn là kiểm tra xem tất cả các trường trong addNewUserFormData có giá trị không rỗng hay không, bạn có thể sử dụng phương thức every:

```jsx
const allFieldsFilled = Object.keys(addNewUserFormData).every((key) => addNewUserFormData[key].trim() !== '');
console.log(allFieldsFilled); // false
```

- .every(callback): Phương thức every kiểm tra xem tất cả các phần tử trong mảng có thỏa mãn điều kiện của callback hay không. Nó trả về true nếu tất cả phần tử thỏa mãn, ngược lại trả về false.
- Trong trường hợp này, allFieldsFilled sẽ là false vì không phải tất cả các trường đều có giá trị không rỗng.
- Hàm handleSaveButtonValid mà bạn cung cấp sẽ kiểm tra từng giá trị trong đối tượng addNewUserFormData để xem liệu chúng có phải là chuỗi không rỗng sau khi đã được trim hay không. Tuy nhiên, hàm hiện tại trả về một mảng các giá trị boolean, không phải một giá trị boolean tổng hợp để xác định xem tất cả các trường đều hợp lệ hay không.
- Nếu mục tiêu của bạn là kiểm tra xem tất cả các trường trong addNewUserFormData đều có giá trị không rỗng, bạn nên sửa hàm này để trả về một giá trị boolean duy nhất. Dưới đây là cách sửa đổi hàm handleSaveButtonValid để làm điều đó:

```jsx
const handleSaveButtonValid = () => {
    return Object.keys(addNewUserFormData).every((key) => addNewUserFormData[key].trim() !== '');
};
```

# Giải Thích
- Object.keys(addNewUserFormData): Lấy tất cả các khóa của đối tượng addNewUserFormData và trả về một mảng chứa các khóa này.
- .every((key) => addNewUserFormData[key].trim() !== ''): Kiểm tra xem tất cả các giá trị của các khóa trong đối tượng addNewUserFormData có phải là chuỗi không rỗng sau khi được trim hay không.
- addNewUserFormData[key]: Lấy giá trị tương ứng với khóa key.
- .trim() !== '': Loại bỏ khoảng trắng từ đầu và cuối của chuỗi và kiểm tra xem chuỗi có rỗng hay không. Nếu chuỗi không rỗng, điều kiện này trả về true.

# Ví Dụ
- Giả sử bạn có đối tượng addNewUserFormData như sau:

```jsx
const addNewUserFormData = {
    username: ' john_doe ',
    email: 'john@example.com',
    password: ' ',
    confirmPassword: 'password123'
};
```

- Khi gọi hàm handleSaveButtonValid:

```jsx
const isValid = handleSaveButtonValid();
console.log(isValid); // false
```

- Trong trường hợp này, isValid sẽ là false vì trường password chứa chuỗi rỗng sau khi trim.

## Tích Hợp Vào Logic Ứng Dụng
- Bạn có thể sử dụng hàm handleSaveButtonValid để kiểm tra điều kiện trước khi cho phép người dùng lưu dữ liệu. Ví dụ, bạn có thể sử dụng hàm này để vô hiệu hóa nút lưu nếu bất kỳ trường nào trống:

```jsx
<button disabled={!handleSaveButtonValid()}>Save</button>
```

- Nút "Save" sẽ bị vô hiệu hóa nếu handleSaveButtonValid trả về false.

## Kết Luận
- Hàm sửa đổi handleSaveButtonValid sẽ kiểm tra xem tất cả các trường trong addNewUserFormData có giá trị không rỗng sau khi trim hay không, và trả về một giá trị boolean duy nhất, giúp bạn dễ dàng xác định điều kiện hợp lệ để cho phép lưu dữ liệu.

### Sửa lại thẻ div thành form

- Ban đầu
```jsx
<div className="grid gap-4 py-4">
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
</div>
```

- Lúc sau

```jsx
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
</form>
```

- Cho thẻ DialogFooter để có thể dùng hàm action trong thẻ form

```jsx
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
```