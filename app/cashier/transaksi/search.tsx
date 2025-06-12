"use client"

import { InputComponent } from "@/components/InputComponent"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

type Props = {
    url: string,
    search: string
}
const Search = ({ url, search }: Props) => {
    const [keyword, setKeyword] = useState<string>(search)
    const router = useRouter()

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        router.push(`${url}?search=${keyword}`)
    }

    return (
        <InputComponent id="keyword" type="text" value={keyword} onChange={value => setKeyword(value)}
            placeholder="Search" onKeyUp={event => handleSearch(event)} />
    )
}
export default Search