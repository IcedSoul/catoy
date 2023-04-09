import { Button, ButtonProps, Group } from '@mantine/core';
import { GoogleIcon } from './GoogleIcon';
import {IconBrandGithub} from "@tabler/icons-react";

interface SocialButtonProps extends ButtonProps {
    onClicked?: () => void;
}
export function GoogleButton(props: SocialButtonProps) {
    return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}

export function GithubButton(props: SocialButtonProps) {
    return (
        <Button
            {...props}
            leftIcon={<IconBrandGithub size="1rem" />}
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                color: '#fff',
                '&:hover': {
                    backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                },
            })}
        />
    );
}

// export function SocialButtons() {
//     return (
//         <Group position="center" sx={{ padding: 15 }}>
//             <GoogleButton>Continue with Google</GoogleButton>
//             <GithubButton>Login with GitHub</GithubButton>
//         </Group>
//     );
// }