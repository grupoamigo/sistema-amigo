import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './driver.reducer';
import { IDriver } from 'app/shared/model/driver.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDriverDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DriverDetail extends React.Component<IDriverDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { driverEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.driver.detail.title">Driver</Translate> [<b>{driverEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="officialId">
                <Translate contentKey="sistemaAmigoApp.driver.officialId">Official Id</Translate>
              </span>
            </dt>
            <dd>
              {driverEntity.officialId ? (
                <div>
                  <a onClick={openFile(driverEntity.officialIdContentType, driverEntity.officialId)}>
                    <img
                      src={`data:${driverEntity.officialIdContentType};base64,${driverEntity.officialId}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {driverEntity.officialIdContentType}, {byteSize(driverEntity.officialId)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <span id="firstName">
                <Translate contentKey="sistemaAmigoApp.driver.firstName">First Name</Translate>
              </span>
            </dt>
            <dd>{driverEntity.firstName}</dd>
            <dt>
              <span id="lastName">
                <Translate contentKey="sistemaAmigoApp.driver.lastName">Last Name</Translate>
              </span>
            </dt>
            <dd>{driverEntity.lastName}</dd>
            <dt>
              <span id="picture">
                <Translate contentKey="sistemaAmigoApp.driver.picture">Picture</Translate>
              </span>
            </dt>
            <dd>
              {driverEntity.picture ? (
                <div>
                  <a onClick={openFile(driverEntity.pictureContentType, driverEntity.picture)}>
                    <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                  </a>
                  <span>
                    {driverEntity.pictureContentType}, {byteSize(driverEntity.picture)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.driver.user">User</Translate>
            </dt>
            <dd>{driverEntity.user ? driverEntity.user.email : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/driver" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/driver/${driverEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ driver }: IRootState) => ({
  driverEntity: driver.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DriverDetail);
