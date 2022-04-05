import Link from "next/link"

const Home = () => {
  return (
    <div style={{maxWidth: "60% !important", marginLeft: "20%"}}>
    <Link href="/login?type=drivers">
      Login as a driver
    </Link>
    <br />
    <Link href="/login?type=shippers">
      Login as a shipper
    </Link>
    <br />
    <Link href="/login?type=consignees">
      Login as a consignee
    </Link>
    </div>
  )
}

export default Home