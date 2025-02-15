import { useState } from 'react';

import { CopyButton } from '@/portainer/components/Button/CopyButton';
import { Code } from '@/portainer/components/Code';
import { NavTabs } from '@/portainer/components/NavTabs/NavTabs';
import { useAgentDetails } from '@/portainer/environments/queries/useAgentDetails';

const deployments = [
  {
    id: 'linux',
    label: 'Linux',
    command: `-v "/var/run/docker.sock:/var/run/docker.sock"`,
  },
  {
    id: 'win',
    label: 'Windows',
    command: '-v \\.\\pipe\\docker_engine:\\.\\pipe\\docker_engine',
  },
];

export function DeploymentScripts() {
  const [deployType, setDeployType] = useState(deployments[0].id);

  const agentDetailsQuery = useAgentDetails();

  if (!agentDetailsQuery) {
    return null;
  }

  const options = deployments.map((c) => ({
    id: c.id,
    label: c.label,
    children: <DeployCode code={c.command} />,
  }));

  return (
    <NavTabs
      options={options}
      onSelect={(id: string) => setDeployType(id)}
      selectedId={deployType}
    />
  );
}

interface DeployCodeProps {
  code: string;
}

function DeployCode({ code }: DeployCodeProps) {
  return (
    <>
      <span className="text-muted small">
        When using the socket, ensure that you have started the Portainer
        container with the following Docker flag:
      </span>

      <Code>{code}</Code>
      <CopyButton copyText={code} className="my-6">
        Copy command
      </CopyButton>
    </>
  );
}
