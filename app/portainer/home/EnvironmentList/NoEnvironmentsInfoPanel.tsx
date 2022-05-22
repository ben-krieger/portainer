import { InformationPanel } from '@/react/components/InformationPanel';
import { Link } from '@/portainer/components/Link';
import { TextTip } from '@/react/components/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  return (
    <InformationPanel title="Information">
      <TextTip>
        {isAdmin ? (
          <span>
            No environment available for management. Please head over the
            <Link to="portainer.endpoints.new"> environments view </Link>
            to add an environment.
          </span>
        ) : (
          <span>
            You do not have access to any environment. Please contact your
            administrator.
          </span>
        )}
      </TextTip>
    </InformationPanel>
  );
}
