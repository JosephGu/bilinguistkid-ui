import LoginModal from "../../common/LoginModal";
import Image from "next/image";

function LoginPage() {
  return (
    <>
      <Image
        src="/bg2160.webp"
        alt="image"
        width={1920}
        height={1042}
        layout="responsive"
      />
      <LoginModal></LoginModal>
    </>
  );
}

export default LoginPage;
