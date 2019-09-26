import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './driver.reducer';
import { IDriver } from 'app/shared/model/driver.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDriverUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDriverUpdateState {
  isNew: boolean;
  userId: string;
}

export class DriverUpdate extends React.Component<IDriverUpdateProps, IDriverUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      userId: '0',
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

    this.props.getUsers();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { driverEntity } = this.props;
      const entity = {
        ...driverEntity,
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
    this.props.history.push('/entity/driver');
  };

  render() {
    const { driverEntity, users, loading, updating } = this.props;
    const { isNew } = this.state;

    const { officialId, officialIdContentType, picture, pictureContentType } = driverEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.driver.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.driver.home.createOrEditLabel">Create or edit a Driver</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : driverEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="driver-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="driver-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <AvGroup>
                    <Label id="officialIdLabel" for="officialId">
                      <Translate contentKey="sistemaAmigoApp.driver.officialId">Official Id</Translate>
                    </Label>
                    <br />
                    {officialId ? (
                      <div>
                        <a onClick={openFile(officialIdContentType, officialId)}>
                          <img src={`data:${officialIdContentType};base64,${officialId}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {officialIdContentType}, {byteSize(officialId)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('officialId')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_officialId" type="file" onChange={this.onBlobChange(true, 'officialId')} accept="image/*" />
                    <AvInput
                      type="hidden"
                      name="officialId"
                      value={officialId}
                      validate={{
                        required: { value: true, errorMessage: translate('entity.validation.required') }
                      }}
                    />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="firstNameLabel" for="driver-firstName">
                    <Translate contentKey="sistemaAmigoApp.driver.firstName">First Name</Translate>
                  </Label>
                  <AvField
                    id="driver-firstName"
                    type="text"
                    name="firstName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="lastNameLabel" for="driver-lastName">
                    <Translate contentKey="sistemaAmigoApp.driver.lastName">Last Name</Translate>
                  </Label>
                  <AvField
                    id="driver-lastName"
                    type="text"
                    name="lastName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="pictureLabel" for="picture">
                      <Translate contentKey="sistemaAmigoApp.driver.picture">Picture</Translate>
                    </Label>
                    <br />
                    {picture ? (
                      <div>
                        <a onClick={openFile(pictureContentType, picture)}>
                          <Translate contentKey="entity.action.open">Open</Translate>
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {pictureContentType}, {byteSize(picture)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('picture')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_picture" type="file" onChange={this.onBlobChange(false, 'picture')} />
                    <AvInput type="hidden" name="picture" value={picture} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label for="driver-user">
                    <Translate contentKey="sistemaAmigoApp.driver.user">User</Translate>
                  </Label>
                  <AvInput id="driver-user" type="select" className="form-control" name="user.id">
                    <option value="" key="0" />
                    {users
                      ? users.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.email}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/driver" replace color="info">
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
  users: storeState.userManagement.users,
  driverEntity: storeState.driver.entity,
  loading: storeState.driver.loading,
  updating: storeState.driver.updating,
  updateSuccess: storeState.driver.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
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
)(DriverUpdate);
