import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './inspection.reducer';
import { IInspection } from 'app/shared/model/inspection.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IInspectionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class InspectionDetail extends React.Component<IInspectionDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { inspectionEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.inspection.detail.title">Inspection</Translate> [<b>{inspectionEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="date">
                <Translate contentKey="sistemaAmigoApp.inspection.date">Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={inspectionEntity.date} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="signature">
                <Translate contentKey="sistemaAmigoApp.inspection.signature">Signature</Translate>
              </span>
            </dt>
            <dd>
              {inspectionEntity.signature ? (
                <div>
                  <a onClick={openFile(inspectionEntity.signatureContentType, inspectionEntity.signature)}>
                    <img
                      src={`data:${inspectionEntity.signatureContentType};base64,${inspectionEntity.signature}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                  <span>
                    {inspectionEntity.signatureContentType}, {byteSize(inspectionEntity.signature)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.inspection.location">Location</Translate>
            </dt>
            <dd>{inspectionEntity.location ? inspectionEntity.location.address : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/inspection" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/inspection/${inspectionEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ inspection }: IRootState) => ({
  inspectionEntity: inspection.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionDetail);
