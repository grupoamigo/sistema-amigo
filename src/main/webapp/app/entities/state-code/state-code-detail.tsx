import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './state-code.reducer';
import { IStateCode } from 'app/shared/model/state-code.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IStateCodeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class StateCodeDetail extends React.Component<IStateCodeDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { stateCodeEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.stateCode.detail.title">StateCode</Translate> [<b>{stateCodeEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="code">
                <Translate contentKey="sistemaAmigoApp.stateCode.code">Code</Translate>
              </span>
            </dt>
            <dd>{stateCodeEntity.code}</dd>
            <dt>
              <span id="name">
                <Translate contentKey="sistemaAmigoApp.stateCode.name">Name</Translate>
              </span>
            </dt>
            <dd>{stateCodeEntity.name}</dd>
          </dl>
          <Button tag={Link} to="/entity/state-code" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/state-code/${stateCodeEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ stateCode }: IRootState) => ({
  stateCodeEntity: stateCode.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StateCodeDetail);
