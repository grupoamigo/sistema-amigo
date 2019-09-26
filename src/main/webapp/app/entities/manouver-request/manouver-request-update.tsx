import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ILocation } from 'app/shared/model/location.model';
import { getEntities as getLocations } from 'app/entities/location/location.reducer';
import { IManouver } from 'app/shared/model/manouver.model';
import { getEntities as getManouvers } from 'app/entities/manouver/manouver.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './manouver-request.reducer';
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IManouverRequestUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IManouverRequestUpdateState {
  isNew: boolean;
  originId: string;
  destinyId: string;
  manouverId: string;
}

export class ManouverRequestUpdate extends React.Component<IManouverRequestUpdateProps, IManouverRequestUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      originId: '0',
      destinyId: '0',
      manouverId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getLocations();
    this.props.getManouvers();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { manouverRequestEntity } = this.props;
      const entity = {
        ...manouverRequestEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/manouver-request');
  };

  render() {
    const { manouverRequestEntity, locations, manouvers, loading, updating } = this.props;
    const { isNew } = this.state;

    const { qrCode, qrCodeContentType } = manouverRequestEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.manouverRequest.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.manouverRequest.home.createOrEditLabel">Create or edit a ManouverRequest</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : manouverRequestEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="manouver-request-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="manouver-request-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="manouver-request-title">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.title">Title</Translate>
                  </Label>
                  <AvField
                    id="manouver-request-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="manouver-request-description">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.description">Description</Translate>
                  </Label>
                  <AvField
                    id="manouver-request-description"
                    type="text"
                    name="description"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLabel" for="manouver-request-date">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.date">Date</Translate>
                  </Label>
                  <AvField
                    id="manouver-request-date"
                    type="date"
                    className="form-control"
                    name="date"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="transportTypeLabel" for="manouver-request-transportType">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.transportType">Transport Type</Translate>
                  </Label>
                  <AvInput
                    id="manouver-request-transportType"
                    type="select"
                    className="form-control"
                    name="transportType"
                    value={(!isNew && manouverRequestEntity.transportType) || 'CAMION'}
                  >
                    <option value="CAMION">{translate('sistemaAmigoApp.TransportType.CAMION')}</option>
                    <option value="FFCC">{translate('sistemaAmigoApp.TransportType.FFCC')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="qrCodeLabel" for="qrCode">
                      <Translate contentKey="sistemaAmigoApp.manouverRequest.qrCode">Qr Code</Translate>
                    </Label>
                    <br />
                    {qrCode ? (
                      <div>
                        <a onClick={openFile(qrCodeContentType, qrCode)}>
                          <img src={`data:${qrCodeContentType};base64,${qrCode}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {qrCodeContentType}, {byteSize(qrCode)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('qrCode')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_qrCode" type="file" onChange={this.onBlobChange(true, 'qrCode')} accept="image/*" />
                    <AvInput type="hidden" name="qrCode" value={qrCode} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label for="manouver-request-origin">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.origin">Origin</Translate>
                  </Label>
                  <AvInput id="manouver-request-origin" type="select" className="form-control" name="origin.id">
                    <option value="" key="0" />
                    {locations
                      ? locations.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.address}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="manouver-request-destiny">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.destiny">Destiny</Translate>
                  </Label>
                  <AvInput id="manouver-request-destiny" type="select" className="form-control" name="destiny.id">
                    <option value="" key="0" />
                    {locations
                      ? locations.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.address}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="manouver-request-manouver">
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.manouver">Manouver</Translate>
                  </Label>
                  <AvInput id="manouver-request-manouver" type="select" className="form-control" name="manouver.id">
                    <option value="" key="0" />
                    {manouvers
                      ? manouvers.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.title}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/manouver-request" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  locations: storeState.location.entities,
  manouvers: storeState.manouver.entities,
  manouverRequestEntity: storeState.manouverRequest.entity,
  loading: storeState.manouverRequest.loading,
  updating: storeState.manouverRequest.updating,
  updateSuccess: storeState.manouverRequest.updateSuccess
});

const mapDispatchToProps = {
  getLocations,
  getManouvers,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManouverRequestUpdate);
