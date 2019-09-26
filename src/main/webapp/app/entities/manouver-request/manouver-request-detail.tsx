import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './manouver-request.reducer';
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IManouverRequestDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ManouverRequestDetail extends React.Component<IManouverRequestDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { manouverRequestEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.manouverRequest.detail.title">ManouverRequest</Translate> [
            <b>{manouverRequestEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="sistemaAmigoApp.manouverRequest.title">Title</Translate>
              </span>
            </dt>
            <dd>{manouverRequestEntity.title}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.manouverRequest.description">Description</Translate>
              </span>
            </dt>
            <dd>{manouverRequestEntity.description}</dd>
            <dt>
              <span id="date">
                <Translate contentKey="sistemaAmigoApp.manouverRequest.date">Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={manouverRequestEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="transportType">
                <Translate contentKey="sistemaAmigoApp.manouverRequest.transportType">Transport Type</Translate>
              </span>
            </dt>
            <dd>{manouverRequestEntity.transportType}</dd>
            <dt>
              <span id="qrCode">
                <Translate contentKey="sistemaAmigoApp.manouverRequest.qrCode">Qr Code</Translate>
              </span>
            </dt>
            <dd>
              {manouverRequestEntity.qrCode ? (
                <div>
                  <a onClick={openFile(manouverRequestEntity.qrCodeContentType, manouverRequestEntity.qrCode)}>
                    <img
                      src={`data:${manouverRequestEntity.qrCodeContentType};base64,${manouverRequestEntity.qrCode}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {manouverRequestEntity.qrCodeContentType}, {byteSize(manouverRequestEntity.qrCode)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.manouverRequest.origin">Origin</Translate>
            </dt>
            <dd>{manouverRequestEntity.origin ? manouverRequestEntity.origin.address : ''}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.manouverRequest.destiny">Destiny</Translate>
            </dt>
            <dd>{manouverRequestEntity.destiny ? manouverRequestEntity.destiny.address : ''}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.manouverRequest.manouver">Manouver</Translate>
            </dt>
            <dd>{manouverRequestEntity.manouver ? manouverRequestEntity.manouver.title : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/manouver-request" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/manouver-request/${manouverRequestEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ manouverRequest }: IRootState) => ({
  manouverRequestEntity: manouverRequest.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManouverRequestDetail);
