import { Body, Container, Head, Heading, Html, Tailwind, Text } from "@react-email/components"

type EmailProps = {
    name: string,
    email: string,
    booleanValue: boolean,
}

export const Email: React.FC<Readonly<EmailProps>> = ({
    name,
    email,
    booleanValue
}) => {
    return (
<Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] px-[20px]">
            <Heading className="mx-auto text-center items-center mb-[20px] mt-[20px]">
            </Heading>
            <Heading className="text-[14px] leading-[24px] text-black">
              Amplify Test
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Name:&nbsp;<strong>{name}</strong>. <br />
              Email:&nbsp;<strong>{email}</strong>. <br />
              booleanValue:&nbsp;<strong>{booleanValue ? "booleanValue Checked" : "booleanValue NOT Checked"}</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
    )
}
