import { useContext } from 'react';

import { ReplayTwoTone } from '@mui/icons-material';
import { Button } from '@mui/material';

import { EnvContext } from '../../env.context';
import { useSseReloadList } from '../../hooks/api';

/**
 * Button to reload the list of reports
 *
 * @param action
 */
export function ReloadButton({ action }: { action: () => void }) {
    const envCtx = useContext(EnvContext);

    const { reloadCount, resetReloadCount } = useSseReloadList(envCtx.backendUrl);

    const handleReload = () => {
        if (action) {
            action();
        }
        resetReloadCount();
    };

    return (
        <Button
            className="reloadButton"
            onClick={handleReload}
            startIcon={<ReplayTwoTone />}
            variant="contained"
            color="primary" // Example of how to set color
            size="large"
            style={{ margin: '1rem' }} // Example of how to apply inline styles
        >
            Reload count: {reloadCount}
        </Button>
    );
}

export default ReloadButton;
