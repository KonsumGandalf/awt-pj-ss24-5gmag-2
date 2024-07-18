import React, { useContext } from 'react';

import { ReplayTwoTone } from '@mui/icons-material';
import { Button, ButtonProps, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

import { EnvContext } from '../../env.context';
import { useSseReloadList } from '../../hooks/api';

/**
 * Button to reload the list of reports
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.action - The action to be executed when the button is clicked.
 * @param {string} props.topic - The topic of the SSE.
 */
export function ReloadButton({ action, topic }: { action: () => void; topic: string }) {
    const envCtx = useContext(EnvContext);

    const { reloadCount, resetReloadCount } = useSseReloadList(envCtx.backendUrl, topic);

    const ReloadButton = styled(Button)<ButtonProps>(({ theme }) => ({
        color: theme.palette.background.default,
        size: 'large',
        margin: '1rem',
        inlineSize: '15rem',
    }));

    const handleReload = () => {
        if (action) {
            action();
        }
        resetReloadCount();
    };

    return (
        <ReloadButton
            className="reloadButton"
            onClick={handleReload}
            startIcon={<ReplayTwoTone />}
            variant={'contained'}
        >
            {topic} count: {reloadCount}
        </ReloadButton>
    );
}

export default ReloadButton;
