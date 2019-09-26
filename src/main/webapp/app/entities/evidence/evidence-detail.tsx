import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './evidence.reducer';
import { IEvidence } from 'app/shared/model/evidence.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEvidenceDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class EvidenceDetail extends React.Component<IEvidenceDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { evidenceEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.evidence.detail.title">Evidence</Translate> [<b>{evidenceEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="sistemaAmigoApp.evidence.name">Name</Translate>
              </span>
            </dt>
            <dd>{evidenceEntity.name}</dd>
            <dt>
              <span id="file">
                <Translate contentKey="sistemaAmigoApp.evidence.file">File</Translate>
              </span>
            </dt>
            <dd>
              {evidenceEntity.file ? (
                <div>
                  <a onClick={openFile(evidenceEntity.fileContentType, evidenceEntity.file)}>
                    <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                  </a>
                  <span>
                    {evidenceEntity.fileContentType}, {byteSize(evidenceEntity.file)}
                  </span>
                </div>
              ) : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/evidence" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/evidence/${evidenceEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ evidence }: IRootState) => ({
  evidenceEntity: evidence.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvidenceDetail);
