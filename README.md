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