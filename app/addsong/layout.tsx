export const metadata /*data awal yang ketika html tersebut dijalankan*/= {
    title: 'Regis | UKL',
    description: 'Praktikum SMK Telkom Malang'
}

type PropsLayout = {
    children: React.ReactNode /* tipe data yang isinya dimungkingkan diisi oleh jsx (html yang ditulis dengan javascript) */
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <div>{children}</div>
    )
}

export default RootLayout